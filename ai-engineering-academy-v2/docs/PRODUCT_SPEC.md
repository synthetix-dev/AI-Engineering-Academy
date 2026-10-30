# Product Specification — AI Engineering Academy 2.0

## 1. Product Positioning & Mission

AI Engineering Academy 2.0 is a free, interactive, open-source educational platform engineered to train production-grade AI Engineers.
Interface Language: **Ukrainian (`uk`)**.
Monetization Requirement: **Zero mandatory paid APIs, subscriptions, or proprietary SaaS tools**.

### Core Educational Principle
Students learn by building, modifying, evaluating, and deploying real AI systems. Manual programming is not mandatory for initial conceptual onboarding, but every mechanic provides an interactive transition into actual production code, mathematical intuition, and engineering architecture.

---

## 2. Tripartite Learning Mechanics

### 2.1. Discover — Understand the Technology (Brilliant-Style)
- **Format**: Concise interactive visual explanations, live sliders, and conceptual playgrounds.
- **Workflow**: Short Explanation → Interactive User Action → Live Calculated Result → Explanation of Outcome → Comprehension Check Question.
- **Examples**:
  - Interactive decision boundary updating as points are clicked on a 2D plane.
  - Learning rate slider showing gradient descent convergence vs divergence on loss landscapes.
  - Interactive neuron activation visualizer comparing ReLU vs Sigmoid vanishing gradients.
  - Tokenization chips with BPE subwords and integer token IDs.
  - Temperature, Top-p, and Repetition penalty effects on token sampling.
  - Self-Attention heatmap displaying Query x Key weights for contextual ambiguity resolution.

### 2.2. Create — Build Your Own AI (Teachable Machine-Style)
- **Format**: Natural 7-step builder allowing users to create real AI systems without node-graph clutter:
  1. Task Selection (Image Classification, Sentiment/Spam, Tabular Regression, Knowledge RAG, ReAct Agent).
  2. Data Preparation & Inspection.
  3. Model Architecture Selection.
  4. Interactive Training (Browser or Server-assisted) with real-time loss curves.
  5. Test & Analyze (Confusion Matrix, F1-Score, Edge cases).
  6. Hyperparameter Improvement (Expandable Advanced Engineering Settings).
  7. Save & Version into User AI Project.

### 2.3. Master — Master Engineering (CodeCrafters / Hack The Box Style)
- **Format**: Practical engineering challenges featuring broken production systems:
  - Overfitting decision tree (train acc 100%, test 60%).
  - Data leakage in feature scaling pipeline.
  - Loss NaN / exploding gradients in deep neural network.
  - Spurious correlations in text classification.
  - Irrelevant RAG retrieval causing hallucination.
  - Catastrophic forgetting during LoRA fine-tuning.
  - Prompt injection vulnerabilities in autonomous agent tools.
  - Silent data drift in production MLOps deployment.
  - Catastrophic accuracy loss during naive INT4 quantization.
- **Verification**: Deterministic test suites evaluate user fixes against hidden benchmark datasets and grant verified XP rewards upon passing all criteria.

---

## 3. AI Evolution Engine

Students develop persistent digital AI systems through 3 project typologies:
1. **AI Companion**: Assistants equipped with instructions, persistent memory, domain RAG knowledge bases, and authorized tools.
2. **AI Model**: Individual trained models for classification, regression, clustering, computer vision, NLP, or fine-tuning adapters.
3. **AI Product**: Complete end-to-end applications integrating models, REST APIs, safety guardrails, evaluations, and deployment metrics.

### AI Skills System (Real Technical Implementation)
- **Knowledge** → Vector Search & pgvector RAG.
- **Instructions** → Structured Few-Shot Prompt Engineering with JSON Schema validation.
- **Classification** → Scikit-Learn Machine Learning.
- **Specialization** → PyTorch LoRA Fine-Tuning with before/after weight checkpoint verification.
- **Perception** → Computer Vision kernels (Sobel/Gaussian) & NLP Tokenization.
- **Actions** → Autonomous Agent Tool Calling with sandboxed execution.
- **Reliability** → Deterministic Hidden Benchmark Evaluations.
- **Production** → MLOps Drift Detection & Version Rollback.
