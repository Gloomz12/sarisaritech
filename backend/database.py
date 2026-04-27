import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
    )

def test_connection():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute('SELECT version();')
        db_version = cur.fetchone()
        print("--- Connection Successful! ---")
        print(f"Database version: {db_version[0]}")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"--- Connection Failed: {e} ---")

if __name__ == "__main__":
    test_connection()