# WeWatch - HackZurich 2023

This repository is dedicated to the analysis and predictive maintenance of rail switches, particularly as part of the Siemens Challenge. Siemens has provided APIs to access recordings of their data, and this repository contains the Docker Compose configuration to simplify the deployment and management of the required components for this task.

## Table of Contents
- [WeWatch - HackZurich 2023](#wewatch---hackzurich-2023)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Usage](#usage)
  - [Configuration](#configuration)
  - [Contributing](#contributing)
  - [License](#license)

## Prerequisites

Before you can use this Docker Compose configuration to run the dashboard and its components, make sure you have the following prerequisites installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Usage

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/AhmedARadwan/hackzurich2023.git
    ```

2. Navigate to the repository's directory:

    ```bash
    cd hackzurich2023
    ```

3. Build and start the Docker containers using Docker Compose:

    ```bash
    docker-compose up --build
    ```

4. Access the dashboard in your web browser by navigating to `http://localhost:3000`.

5. To stop and remove the containers, run:

    ```bash
    docker-compose down
    ```

## Configuration

You can customize the configuration of the dashboard and its components by editing the `docker-compose.yml` file. The `docker-compose.yml` file defines the services and their dependencies.

Make sure to update any environment variables, ports, or volumes according to your specific requirements.

## Contributing

If you'd like to contribute to this project, please follow these steps:

1. Fork the repository to your own GitHub account.

2. Create a new branch with a descriptive name for your feature or bug fix:

    ```bash
    git checkout -b feature/my-feature
    ```

3. Make your changes and commit them with clear and concise messages:

    ```bash
    git commit -m "Add new feature: My Feature"
    ```

4. Push your changes to your forked repository:

    ```bash
    git push origin feature/my-feature
    ```

5. Open a pull request against the `main` branch of this repository.

We welcome contributions and appreciate your help in improving this project.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as needed, but please provide proper attribution and keep the license intact.