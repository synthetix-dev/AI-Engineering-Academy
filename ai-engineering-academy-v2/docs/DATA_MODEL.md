# Data Model Specification — AI Engineering Academy 2.0

## 1. Overview

The platform uses a normalized relational schema with 30 core entities, fully defined via SQLAlchemy 2.0 declarative models and Pydantic v2 validation contracts.

## 2. Entity Dictionary (All 30 Tables)

### Authentication & Users
1. `users`: ID (UUID), Email, Hashed Password, Full Name, Role (`student`, `engineer`, `admin`), Career Goal, XP, Level, Timestamps.
2. `sessions`: Session ID, User ID (FK), Token, Expiration, Timestamp.
3. `user_preferences`: Preference ID, User ID (FK), Theme (`light`, `dark`), Code Font Size, Auto Inspect Code, Notification flags.

### Curriculum & Skill Graph
4. `career_paths`: Path ID, Code, Title, Description, Icon, Priority Track IDs (JSON), Recommended Sequence (JSON).
5. `skills`: Skill ID, Code, Name, Category, Description, Level (1-5), Track ID (FK), Verification Method (`deterministic_test`, `benchmark`).
6. `skill_prerequisites`: Prerequisite ID, Skill ID (FK), Required Prerequisite Skill ID (FK).
7. `courses`: Course ID, Code, Title, Description, Difficulty Level.
8. `modules`: Module ID, Course ID (FK), Title, Sequence Order.
9. `lessons`: Lesson ID, Module ID (FK), Track Slug, Title, Slug, Concept Summary, Steps & Blueprints (JSON).
10. `activities`: Activity ID, Lesson ID (FK), Activity Type, Title, Interactive Configuration (JSON), Order.

### Engineering Challenges & Evaluation
11. `challenges`: Challenge ID, Track Slug, Title, Difficulty, Problem Statement, Bug Symptom, Broken Config (JSON), Target Criteria (JSON), XP Reward.
12. `challenge_attempts`: Attempt ID, Challenge ID (FK), User ID (FK), Submitted Config (JSON), Status (`passed`, `failed`), Metrics (JSON), Logs (JSON), Test Counts, Timestamp.
13. `evaluations`: Evaluation ID, Task ID, User ID (FK), Model ID (FK), Dataset ID, Metrics (JSON), Passed boolean, Deterministic Hash, Error Logs (JSON), Execution Time.
14. `user_skill_progress`: Progress ID, User ID (FK), Skill ID (FK), Status (`locked`, `available`, `verified`), Verified Timestamp, Score, Evidence Attempt ID.

### AI Evolution Projects & Model Registry
15. `projects`: Project ID, User ID (FK), Name, Description, Project Type (`companion`, `model`, `product`), Evolution Level, Version (`v1.0.0`), Active Model ID, Attached Skills (JSON), Configuration (JSON), Metrics (JSON), Status.
16. `project_members`: Member ID, Project ID (FK), User ID (FK), Role, Added Timestamp.
17. `models`: Model ID, User ID (FK), Project ID (FK), Name, Description, Framework (`pytorch`, `scikit-learn`, `onnx`, `tfjs`), Architecture, Base Model Tag.
18. `model_versions`: Version ID, Model ID (FK), Version Tag, Weights Path, Verified Metrics (JSON).
19. `model_adapters`: Adapter ID, Model Version ID (FK), Adapter Type (`lora`, `qlora`), Rank `r`, Alpha, Checkpoint File Path, Trainable Parameter Count.

### Datasets, Experiments & Artifacts
20. `datasets`: Dataset ID, Name, Slug, Description, Category (`tabular`, `nlp`, `vision`, `instruction_tuning`), Record Count, Schema Definition (JSON), Sample Preview (JSON).
21. `dataset_versions`: Version ID, Dataset ID (FK), Version Tag, File Storage Path, Row Count.
22. `training_jobs`: Job ID, User ID (FK), Project ID (FK), Job Type (`ml_training`, `fine_tuning`, `eval`), Status (`queued`, `running`, `completed`, `failed`, `cancelled`), Parameters (JSON), Metrics (JSON), Error Message, Timestamps.
23. `experiment_runs`: Run ID, User ID (FK), Project ID (FK), Run Name, Track Slug, Hyperparameters (JSON), Results Metrics (JSON), Artifacts (JSON), Duration Seconds.
24. `experiment_metrics`: Metric ID, Experiment Run ID (FK), Epoch, Step, Loss, Accuracy, Auxiliary Metrics (JSON).
25. `artifacts`: Artifact ID, Project ID (FK), Experiment Run ID (FK), Name, Artifact Type (`weights`, `metrics_plot`, `manifest`), File Path, Metadata (JSON).

### RAG, Autonomous Agents & Operations
26. `rag_collections`: Collection ID, User ID (FK), Project ID (FK), Name, Description, Embedding Model, Chunk Size, Chunk Overlap.
27. `rag_documents`: Document ID, Collection ID (FK), Title, Raw Content, Chunk Count, Chunk Metadata (JSON).
28. `agent_configs`: Config ID, User ID (FK), Project ID (FK), Name, System Role, Allowed Tools (JSON), Max Iterations Limit.
29. `agent_runs`: Run ID, Agent Config ID (FK), User ID (FK), Task Input, Execution Status, Step-by-Step Trace (JSON), Final Output, Duration Ms.

### Portfolio, Achievements & Audits
30. `achievements`: Achievement ID, Code, Title, Description, Icon, XP Points Award.
31. `portfolio_items`: Item ID, User ID (FK), Project ID (FK), Title, Summary, Demonstrated Skills (JSON), Verified Metrics (JSON), Public Slug, Is Public boolean, Interactive Demo Config (JSON).
32. `audit_events`: Event ID, User ID (FK), Action Tag, Target Type, Target ID, Metadata (JSON), IP Address, Timestamp.
