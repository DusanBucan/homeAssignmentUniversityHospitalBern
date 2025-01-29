# Use official Node.js 20.18.1 image as base
FROM node:20.18.1

# Install required dependencies for building Python from source
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    libssl-dev \
    zlib1g-dev \
    libbz2-dev \
    libreadline-dev \
    libsqlite3-dev \
    wget \
    curl \
    llvm \
    libncurses5-dev \
    libgdbm-dev \
    libnss3-dev \
    libssl-dev \
    libffi-dev \
    liblzma-dev \
    python3-pip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python 3.12 from source since node:20.18.1 has Python 3.11.2
RUN curl -sSL https://www.python.org/ftp/python/3.12.8/Python-3.12.8.tgz -o /tmp/Python-3.12.8.tgz && \
    tar -xzf /tmp/Python-3.12.8.tgz -C /tmp && \
    cd /tmp/Python-3.12.8 && \
    ./configure --enable-optimizations && \
    make -j$(nproc) && \
    make altinstall && \
    rm -rf /tmp/Python-3.12.8 /tmp/Python-3.12.8.tgz

# Install Poetry globally
RUN curl -sSL https://install.python-poetry.org | python3.12 -

SHELL ["/bin/bash", "-c"]

RUN echo "export PATH=$HOME/.local/bin:$PATH" >> ~/.bashrc && source ~/.bashrc

# Install virtualenv
RUN python3.12 -m pip install virtualenv

# Set working directory
WORKDIR /app

# Copy the entire app (excluding node_modules and dist due to .dockerignore)
COPY . /app

RUN mv .env.docker .env

# Install Node.js dependencies
RUN npm install

# Create virtual environment for dicom-parser
RUN virtualenv /app/dicom-parser-venv

# Activate the virtual environment and run Poetry install
RUN source ~/.bashrc && . dicom-parser-venv/bin/activate && \
    cd dicom-parser && \
    poetry install

# # Expose the port that the app will run on
EXPOSE 3000

RUN npm run build

# # Command to start the NestJS app
CMD ["npm", "run", "start:prod"]
