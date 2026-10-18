import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE } from './config'; 

const MANIFEST_URL = `${BASE}/manifest.json`;
const CACHE_KEY = 'vn_story_cache_v2';

export async function loadStory({ forceRefresh = false } = {}) {
    const cached = await readCache();

    try {
        const timestamp = new Date().getTime();
        const manifestRes = await fetch(`${MANIFEST_URL}?t=${timestamp}`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
        });

        if (!manifestRes.ok) throw new Error('manifest fetch failed');
        const manifest = await manifestRes.json();

        if (!forceRefresh && cached && cached.version === manifest.version) {
            return { story: cached.story, version: manifest.version, fromCache: true };
        }

        const storyRes = await fetch(`${BASE}/story.json?v=${manifest.version}&t=${timestamp}`, {
            cache: 'no-store',
        });

        if (!storyRes.ok) throw new Error('story fetch failed');
        const story = await storyRes.json();

        await writeCache({ version: manifest.version, story });
        return { story, version: manifest.version, fromCache: false };
        
    } catch (e) {
        if (cached) {
            return { story: cached.story, version: cached.version, fromCache: true, error: e };
        }
        throw e;
    }
}

async function readCache() {
    try {
        const raw = await AsyncStorage.getItem(CACHE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

async function writeCache(data) {
    try {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {}
}