# database.py
import psycopg2

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="sarisaritech",
        user="postgres",
        password="private",
        port="5432"
    )