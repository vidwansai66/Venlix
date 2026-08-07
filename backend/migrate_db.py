import sqlite3

def migrate():
    conn = sqlite3.connect('venlix.db')
    c = conn.cursor()
    columns = [
        ('current_status', 'VARCHAR DEFAULT "Order Created"'),
        ('current_lat', 'FLOAT'),
        ('current_lng', 'FLOAT'),
        ('store_lat', 'FLOAT'),
        ('store_lng', 'FLOAT'),
        ('drop_lat', 'FLOAT'),
        ('drop_lng', 'FLOAT')
    ]
    for col, dtype in columns:
        try:
            c.execute(f'ALTER TABLE deliveries ADD COLUMN {col} {dtype}')
            print(f'Added {col}')
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                pass
            else:
                print(e)
    conn.commit()
    conn.close()

if __name__ == '__main__':
    migrate()
