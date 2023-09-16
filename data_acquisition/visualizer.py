from flask import Flask, render_template
import sqlite3
import plotly.graph_objs as go  # Import plotly.graph_objs

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/usage')
def usage():
    # Retrieve track usage data from the database
    track_data = get_track_data()

    # Retrieve switches count from the database
    switch_data = get_switch_data()

    # Create a bar chart for track usage
    track_fig = go.Figure(data=[go.Bar(x=[row[0] for row in track_data], y=[row[1] for row in track_data])])
    track_fig.update_layout(title='Track Usage', xaxis_title='Track ID', yaxis_title='Usage Count')

    # Create a bar chart for switch count
    switch_fig = go.Figure(data=[go.Bar(x=[row[0] for row in switch_data], y=[row[1] for row in switch_data])])
    switch_fig.update_layout(title='Switch Count', xaxis_title='Switch ID', yaxis_title='Count')

    return render_template('usage.html', track_fig=track_fig.to_html(full_html=False), switch_fig=switch_fig.to_html(full_html=False))

def get_track_data():
    conn = sqlite3.connect('server/rail_data.db')
    cursor = conn.cursor()
    cursor.execute('SELECT track_id, SUM(usage_count) FROM track_usage_data GROUP BY track_id')
    track_data = cursor.fetchall()
    conn.close()
    return track_data

def get_switch_data():
    conn = sqlite3.connect('server/rail_data.db')
    cursor = conn.cursor()
    cursor.execute('SELECT switch_id, COUNT(*) FROM rail_data GROUP BY switch_id')
    switch_data = cursor.fetchall()
    conn.close()
    return switch_data

if __name__ == '__main__':
    app.run(debug=True)
