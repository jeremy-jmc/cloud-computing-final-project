# https://www.kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset/code
import kagglehub

# Download latest version
path = kagglehub.dataset_download("maharshipandya/-spotify-tracks-dataset")

print("Path to dataset files:", path)


import os
import pandas as pd
from IPython.display import display

pd.set_option('display.max_columns', None)

# Load dataset
df = (
    pd.read_csv(os.path.join(path, "dataset.csv"))
    .drop(columns=['Unnamed: 0'])
    .dropna(how='any')
    # .sort_values(by='artists', ascending=False)
)
print("Dataset shape:", df.shape)
display(df)

df_individual = (
    df
    .loc[~df['artists'].str.contains(';')]
    .loc[df['album_name'].str.isalnum()]
)
print(df_individual.shape)

df_individual.groupby(['artists', 'album_name']).size().reset_index(name='count').sort_values(by='count', ascending=False)


