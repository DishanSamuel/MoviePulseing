import { Client, Databases, Query, ID } from "appwrite"

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID


const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)

const database = new Databases(client);

export const updateSearchcount = async (searchTerm, movie) => {
    try {

        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('searchTerm', searchTerm)]);

        if (result.documents.length > 0) {
            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1
            })
        }

        else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm: searchTerm,
                count: 1,
                poster_url: `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movie.poster_path}`,
                movie_id: movie.id
            })
        }

    }catch (error) {
        console.log(error);
    }
}


export const getTrendingMovies = async() => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count')
        ])

        return result.documents;
    }
    catch (error) {
        console.log(error);
        return [];
    }
}