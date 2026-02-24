Install python 3.13
Install torch seperatly to the rest of the packages to use cuda
py -3.13 -m pip install torch --index-url https://download.pytorch.org/whl/cu118

Install rest of packages
py -3.13 -m pip install -r requirements.txt

Run app
py -3.13 -m uvicorn main:app --reload
