from gremlin_python.driver import client, serializer
import sys

# Configure the Gremlin client to connect to JanusGraph
gremlin_client = client.Client(
    'ws://localhost:8182/gremlin',
    'g',
    message_serializer=serializer.GraphSONSerializersV3d0()
)

def run_query(query: str):
    print(f"\nSending query: {query}")
    try:
        result_set = gremlin_client.submit(query)
        results = result_set.all().result()
        print("Result:", results)
    except Exception as e:
        print("Error:", e)

def main():
    # Optional: clear existing data
    run_query("g.V().drop()")

    # Add a new vertex
    run_query("g.addV('person').property('name', 'Alice').property('age', 30)")

    # Add another vertex
    run_query("g.addV('person').property('name', 'Bob').property('age', 40)")

    # Query all vertices and print their properties
    run_query("g.V().valueMap(true)")

    # Limit to 3 vertices
    run_query("g.V().limit(3).valueMap(true)")

    # Done
    gremlin_client.close()

if __name__ == "__main__":
    main()
