from typing import List
from fastapi import APIRouter
from app.schemas.experiments import DatasetResponse

router = APIRouter(prefix="/datasets", tags=["Datasets"])

STATIC_DATASETS = [
    {
        "id": "ds-iris-tabular",
        "name": "Iris Flower Dataset",
        "slug": "iris-tabular",
        "description": "Класичний датасет класифікації рослин за 4 числовими ознаками.",
        "category": "tabular",
        "size_records": 150,
        "schema_def": {"sepal_length": "float", "sepal_width": "float", "petal_length": "float", "petal_width": "float", "target": "int"},
        "preview": [
            {"sepal_length": 5.1, "sepal_width": 3.5, "petal_length": 1.4, "petal_width": 0.2, "target": 0},
            {"sepal_length": 4.9, "sepal_width": 3.0, "petal_length": 1.4, "petal_width": 0.2, "target": 0},
            {"sepal_length": 7.0, "sepal_width": 3.2, "petal_length": 4.7, "petal_width": 1.4, "target": 1}
        ]
    },
    {
        "id": "ds-wine-tabular",
        "name": "Wine Recognition Dataset",
        "slug": "wine-tabular",
        "description": "Хімічний аналіз 3 сортів вин за 13 спектрометричними ознаками.",
        "category": "tabular",
        "size_records": 178,
        "schema_def": {"alcohol": "float", "malic_acid": "float", "ash": "float", "target": "int"},
        "preview": [
            {"alcohol": 14.23, "malic_acid": 1.71, "ash": 2.43, "target": 0},
            {"alcohol": 13.20, "malic_acid": 1.78, "ash": 2.14, "target": 0}
        ]
    },
    {
        "id": "ds-sms-spam",
        "name": "SMS Spam Collection (Ukrainian/English)",
        "slug": "sms-spam",
        "description": "5,574 текстових повідомлень, маркованих як ham (легітимні) або spam.",
        "category": "nlp",
        "size_records": 5574,
        "schema_def": {"text": "string", "label": "string"},
        "preview": [
            {"text": "Привіт! Зустрінемося завтра о 14:00 біля офісу?", "label": "ham"},
            {"text": "ТЕРМІНОВО! Ви виграли 50,000 грн. Перейдіть за посиланням...", "label": "spam"}
        ]
    },
    {
        "id": "ds-sft-instruction",
        "name": "AI Academy Instruction SFT Dataset",
        "slug": "sft-instruction",
        "description": "Пари Instruction/Input/Response для тонкого довчання (LoRA Fine-tuning).",
        "category": "instruction_tuning",
        "size_records": 1200,
        "schema_def": {"instruction": "string", "input": "string", "output": "string"},
        "preview": [
            {
                "instruction": "Поясни принцип роботи механізму уваги (Self-Attention) простими словами.",
                "input": "",
                "output": "Self-Attention дозволяє кожному слову в реченні оцінити ступінь важливості всіх інших слів для розуміння свого контексту."
            }
        ]
    }
]

@router.get("", response_model=List[DatasetResponse])
async def list_datasets():
    return [DatasetResponse(**d) for d in STATIC_DATASETS]
