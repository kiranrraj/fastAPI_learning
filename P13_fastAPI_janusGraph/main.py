import sys
import asyncio
from gremlin_python.driver import client, serializer

if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# Use GraphSON v2 to match the server’s default
gremlin_client = client.Client(
    'ws://localhost:8182/gremlin',
    'g',
    message_serializer=serializer.GraphSONSerializersV2d0()
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

    # Add sample vertices
    run_query("g.addV('person').property('name', 'Alice').property('age', 30)")
    run_query("g.addV('person').property('name', 'Bob').property('age', 40)")

    # Fetch and print everything
    run_query("g.V().valueMap(true)")

    # Limit to 3 vertices
    run_query("g.V().limit(3).valueMap(true)")

    gremlin_client.close()

if __name__ == "__main__":
    main()
