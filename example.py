import socketio

# Create a Socket.IO client instance
sio = socketio.Client()

# Define the event handler for 'connect_error'
@sio.event
def connect_error(err):
    print("Connect Error:", err)

# Define the event handler for 'depotStateUpdate'
@sio.on('depotStateUpdateStep')
def depot_state_update(update):
    timestamp = update["sentAt"]
    tracks = update["state"]["elements"]["tracks"]
    railswitches = update["state"]["elements"]["railSwitches"]
    routes = update["state"]["routes"]
    print(routes)


    

# Connect to the Socket.IO server
sio.connect('https://depot-hackzurich.iltis.rocks', transports=['websocket'])

# Keep the script running to listen for events
sio.wait()
