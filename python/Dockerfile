# Use official Python image
FROM python:3.10-alpine

# Set working directory inside container
WORKDIR /python

# Copy everything in the current directory (app.py, requirements.txt, etc.) to /python
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port your app runs on
EXPOSE 8080

# Run the app
CMD ["python", "app.py"]