

from pydantic import BaseModel, EmailStr, field_validator, validate_email

class User(BaseModel):
    display_name: str
    alias: str
    members: str 
    owners: str
    notified: bool
    
    @field_validator('members','owners')
    @classmethod
    def should_be_list_of_emails(cls, v: str) -> str:
        emails = [email.strip() for email in v.split(";") if email.strip()]
        for email in emails:
            try:
                validate_email(email)
            except ValueError:
                raise ValueError(f"Invalid email: {email}")
        return v
    
    @field_validator('alias')
    @classmethod
    def should_be_email(cls, v: str) -> str:
        try:
            validate_email(v)
        except ValueError:
            raise ValueError(f"Invalid email: {v}")
        return v