import socketio
import sqlite3
import threading

# Create a Socket.IO client instance
sio = socketio.Client()

# Define a thread-local storage for the database connection and cursor
local = threading.local()

# Define a dictionary to keep track of the previous state of each switch and track usage
previous_switch_states = {}
track_usage = {}

def get_database_connection():
    if not hasattr(local, "conn"):
        local.conn = sqlite3.connect('/home/dbData/rail_data.db')
    return local.conn

def get_database_cursor():
    conn = get_database_connection()
    if not hasattr(local, "cursor"):
        local.cursor = conn.cursor()
    return local.cursor

# Create the 'rail_data' and 'track_usage_data' tables if they don't exist
def create_tables_if_not_exists():
    cursor = get_database_cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS rail_data (
            id INTEGER PRIMARY KEY,
            timestamp TEXT,
            switch_id TEXT,
            switch_position TEXT
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS track_usage_data (
            id INTEGER PRIMARY KEY,
            timestamp TEXT,
            track_id TEXT,
            usage_count INTEGER
        )
    ''')
    get_database_connection().commit()

create_tables_if_not_exists()  # Call the function to create the tables

# Define the event handler for 'connect_error'
@sio.event
def connect_error(err):
    print("Connect Error:", err)

# Define a flag to indicate if initial data has been collected
initial_data_collected = False

# Define the event handler for 'depotStateUpdate'
@sio.on('depotStateUpdateStep')
def depot_state_update(update):
    global initial_data_collected
    timestamp = update["sentAt"]
    railswitches = update["state"]["elements"]["railSwitches"]

    # Get the cursor for the current thread
    cursor = get_database_cursor()

    if not initial_data_collected:
        # Collect initial data for switches and tracks
        insert_initial_data(update, cursor, railswitches, timestamp)
        initial_data_collected = True

    # Iterate through the rail switches and check for changes in position
    for switch in railswitches:
        switch_id = switch["id"]
        position = switch["position"]

        # Get the previous state of the switch from the dictionary
        previous_state = previous_switch_states.get(switch_id)

        if previous_state != position:
            # Insert the change into the 'rail_data' database table
            cursor.execute('INSERT INTO rail_data (timestamp, switch_id, switch_position) VALUES (?, ?, ?)',
                           (timestamp, switch_id, position))
            get_database_connection().commit()

            # Update the previous state in the dictionary
            previous_switch_states[switch_id] = position

            # Print the change
            print(f"Switch {switch_id} changed position to {position}")

    # Count track usage
    tracks = update["state"]["elements"]["tracks"]
    for track in tracks:
        track_id = track["id"]
        occupied = track["occupied"]

        # Get the previous state of the track from the dictionary
        previous_state = track_usage.get(track_id, False)

        if previous_state != occupied and not previous_state and occupied:
            # Track state changed from false to true, increment usage count
            track_usage[track_id] = track_usage.get(track_id, 0) + 1

            # Insert the track usage data into the 'track_usage_data' database table
            cursor.execute('INSERT INTO track_usage_data (timestamp, track_id, usage_count) VALUES (?, ?, ?)',
                           (timestamp, track_id, track_usage[track_id]))
            get_database_connection().commit()

    # Print the most used track
    most_used_track = max(track_usage, key=track_usage.get, default=None)
    if most_used_track is not None:
        print(f"The most used track is {most_used_track} with {track_usage[most_used_track]} usages.")

# Function to collect initial data for switches and tracks
def insert_initial_data(update, cursor, railswitches, timestamp):
    for switch in railswitches:
        switch_id = switch["id"]
        position = switch["position"]

        # Insert the initial data into the 'rail_data' database table
        cursor.execute('INSERT INTO rail_data (timestamp, switch_id, switch_position) VALUES (?, ?, ?)',
                       (timestamp, switch_id, position))

    tracks = update["state"]["elements"]["tracks"]
    for track in tracks:
        track_id = track["id"]

        # Insert the initial data into the 'track_usage_data' database table with usage count 0
        cursor.execute('INSERT INTO track_usage_data (timestamp, track_id, usage_count) VALUES (?, ?, ?)',
                       (timestamp, track_id, 0))

    get_database_connection().commit()

# Connect to the Socket.IO server
sio.connect('https://depot-hackzurich.iltis.rocks', transports=['websocket'])

# Keep the script running to listen for events
sio.wait()
