# Project Architecture: Clean Architecture

This project adheres to the principles of Clean Architecture to achieve a modular, maintainable, and scalable code structure. The architecture is divided into the following layers:

## 1. `core` or `domain`

- **Purpose:** Contains the business rules and fundamental entities of the application. It is independent of any implementation details, such as databases or UI frameworks.
- **Contents:**
  - **Entities:** Represent the key concepts of the problem domain.
  - **Use Cases:** Encapsulate the business logic and orchestrate interactions between entities and other system components.
  - **Interfaces:** Define the contracts that implementations in other layers must adhere to (e.g., repositories or external services).

## 2. `infrastructure`

- **Purpose:** Implements the interaction with the external world, such as databases, APIs, file systems, etc.
- **Contents:**
  - **Repositories:** Implement the interfaces defined in the `core` layer to access and persist data.
  - **External Services:** Encapsulate communication with APIs or third-party services.
  - **Adapters:** Convert data between the format used in the `core` layer and the format required by the external infrastructure.

## 3. `di`

- **Purpose:** Centralizes the configuration of dependency injection (DI) to facilitate the management of dependencies between the different layers.
- **Contents:**
  - **DI Modules:** Define how service and repository instances are created and provided.
  - **DI Containers:** Manage the creation and lifecycle of service instances.

## 4. `presentation`

- **Purpose:** Handles the user interface and user interaction.
- **Contents:**
  - **Components:** Implement the presentation logic and data visualization.
  - **Controllers:** Handle user requests and coordinate interaction with use cases in the `core` layer.
  - **Views:** Define the structure and design of the user interface.

### Key Principles

- **Framework Independence:** The `core` layer does not depend on any specific framework, making it easier to adapt to technological changes or migrate to other platforms.
- **Dependency Inversion:** Higher-level layers (like `presentation`) depend on abstractions defined in the `core` layer, allowing implementations in lower layers to be changed without affecting the business logic.
- **Testability:** Each layer can be tested in isolation, facilitating the creation of unit and integration tests.

### How to Use This Architecture

1. **Define your entities and business rules in the `core` layer.**
2. **Create interfaces in `core` for the services you'll need in other layers.**
3. **Implement those interfaces in the `infrastructure` layer.**
4. **Configure dependency injection in the `di` layer.**
5. **Create your UI components and controllers in the `presentation` layer.**

**Important!** This documentation is a general guide. Adapt the structure and folder names to the specific needs of your project. Feel free to experiment and find what works best for you!

**Tree-like schema**

```
Project
├── core/domain
│   ├── entities (optional)
│   ├── business rules
│   ├── use cases
│   └── interfaces
├── infrastructure
│   ├── repositories
│   ├── external services
│   └── adapters
├── di
│   ├── DI modules
│   └── DI containers
└── presentation
    ├── components
    ├── controllers
    └── views
```
