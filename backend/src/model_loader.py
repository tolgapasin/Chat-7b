from dotenv import load_dotenv
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline, BitsAndBytesConfig
from langchain_huggingface.llms import HuggingFacePipeline
from os import getenv
from torch import float16
import torch

def load_model() -> HuggingFacePipeline:
    load_dotenv()
    local_model_path = getenv("LOCAL_MODEL_PATH")

    print("\n" + "="*50)
    if torch.cuda.is_available():
        print(f"  GPU is available")
        print(f"  GPU Device: {torch.cuda.get_device_name(0)}")
    else:
        print(f"  GPU is NOT available - model will run on CPU")
    print("="*50 + "\n")

    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_compute_dtype=float16,
        bnb_4bit_use_double_quant=True,
        bnb_4bit_quant_type="nf4"
    )

    model = AutoModelForCausalLM.from_pretrained(
        local_model_path,
        quantization_config=bnb_config,
        device_map="auto",
        torch_dtype=float16
    )
    tokenizer = AutoTokenizer.from_pretrained(local_model_path)

    # TODO: add configurable max new tokens
    pipe = pipeline(
        task="text-generation",
        model=model,
        tokenizer=tokenizer,
        return_full_text=False,
        do_sample=True,
        model_kwargs={"temperature": 0.7, "top_p": 0.95, "repetition_penalty": 1.1}
    )

    return HuggingFacePipeline(pipeline=pipe)