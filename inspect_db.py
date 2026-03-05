
import sqlite3

conn = sqlite3.connect('backend/gapeva.db')
cursor = conn.cursor()

print("Schema for 'transactions' table:")
try:
    cursor.execute("PRAGMA table_info(transactions)")
    columns = cursor.fetchall()
    for col in columns:
        print(col)
except Exception as e:
    print(e)

conn.close()
