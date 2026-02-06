from app.database import SessionLocal
from app.models import User

db = SessionLocal()
user = db.query(User).filter(User.email == "kipkoechtony510@gmail.com").first()
if user:
    print(f"User found: {user.email}")
    print(f"Hashed Password: '{user.hashed_password}'")
else:
    print("User not found")
