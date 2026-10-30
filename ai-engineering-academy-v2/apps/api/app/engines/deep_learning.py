import torch
import torch.nn as nn
import torch.optim as optim
from typing import Any, Dict, List
import numpy as np
from sklearn.datasets import make_moons

class FlexibleMLP(nn.Module):
    def __init__(self, in_features: int, hidden_layers: List[int], out_features: int, activation: str = "relu"):
        super().__init__()
        layers = []
        prev_dim = in_features

        act_cls = nn.ReLU if activation.lower() == "relu" else (nn.Tanh if activation.lower() == "tanh" else nn.GELU)

        for h_dim in hidden_layers:
            layers.append(nn.Linear(prev_dim, h_dim))
            layers.append(act_cls())
            prev_dim = h_dim

        layers.append(nn.Linear(prev_dim, out_features))
        self.network = nn.Sequential(*layers)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.network(x)

def train_pytorch_network(
    hidden_layers: List[int] = [16, 8],
    learning_rate: float = 0.02,
    epochs: int = 15,
    batch_size: int = 32,
    activation: str = "relu",
    seed: int = 42
) -> Dict[str, Any]:
    """Train a real PyTorch neural network on CPU and return per-epoch loss and metrics."""
    torch.manual_seed(seed)
    np.random.seed(seed)

    # 1. Generate non-linear classification dataset (Moons)
    X_raw, y_raw = make_moons(n_samples=400, noise=0.2, random_state=seed)
    
    # Split 80/20
    split_idx = int(0.8 * len(X_raw))
    X_train_t = torch.tensor(X_raw[:split_idx], dtype=torch.float32)
    y_train_t = torch.tensor(y_raw[:split_idx], dtype=torch.long)
    X_val_t = torch.tensor(X_raw[split_idx:], dtype=torch.float32)
    y_val_t = torch.tensor(y_raw[split_idx:], dtype=torch.long)

    # 2. Instantiate Model
    model = FlexibleMLP(in_features=2, hidden_layers=hidden_layers, out_features=2, activation=activation)
    total_params = sum(p.numel() for p in model.parameters() if p.requires_grad)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)

    history = []

    # 3. Training Loop
    dataset_size = len(X_train_t)
    for epoch in range(1, epochs + 1):
        model.train()
        permutation = torch.randperm(dataset_size)
        epoch_loss = 0.0
        batches_count = 0
        total_grad_norm = 0.0

        for i in range(0, dataset_size, batch_size):
            indices = permutation[i:i + batch_size]
            batch_x, batch_y = X_train_t[indices], y_train_t[indices]

            optimizer.zero_grad()
            outputs = model(batch_x)
            loss = criterion(outputs, batch_y)
            loss.backward()

            # Measure gradient norm
            grad_norm = 0.0
            for p in model.parameters():
                if p.grad is not None:
                    grad_norm += p.grad.data.norm(2).item() ** 2
            grad_norm = grad_norm ** 0.5
            total_grad_norm += grad_norm

            optimizer.step()
            epoch_loss += loss.item()
            batches_count += 1

        avg_train_loss = epoch_loss / max(1, batches_count)
        avg_grad_norm = total_grad_norm / max(1, batches_count)

        # Evaluation
        model.eval()
        with torch.no_grad():
            train_preds = model(X_train_t).argmax(dim=1)
            train_acc = (train_preds == y_train_t).float().mean().item()

            val_outputs = model(X_val_t)
            val_loss = criterion(val_outputs, y_val_t).item()
            val_preds = val_outputs.argmax(dim=1)
            val_acc = (val_preds == y_val_t).float().mean().item()

        history.append({
            "epoch": epoch,
            "train_loss": round(avg_train_loss, 4),
            "train_accuracy": round(train_acc, 4),
            "val_loss": round(val_loss, 4),
            "val_accuracy": round(val_acc, 4),
            "grad_norm": round(avg_grad_norm, 4)
        })

    return {
        "architecture": {
            "in_features": 2,
            "hidden_layers": hidden_layers,
            "out_features": 2,
            "total_trainable_parameters": total_params,
            "activation": activation
        },
        "final_metrics": {
            "final_train_loss": history[-1]["train_loss"],
            "final_val_loss": history[-1]["val_loss"],
            "final_val_accuracy": history[-1]["val_accuracy"]
        },
        "history": history
    }
