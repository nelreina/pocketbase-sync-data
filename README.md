# pocketbase-sync-data

Simple Project to sync data between to Pocketbase instances


### Install

```shell
git clone https://github.com/nelreina/pocketbase-sync-data.git
mv dotemv .env
npm i # or pnpm i 

```

### Configuration

- Edit .env file with the Admin credentials from Source and Target Pocketbase.

- Put collection name(s) in the .env file collection keys 
 > IMPORTANT: if you have multiple collections the order of clearing and copy is important if there relations between collections
