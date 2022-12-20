// We want to dedupe and prefer the highest version when deduping
const features = [
    {
        id: '1',
        name: 'feature 1',
        type: 'standard',
        metadata: {
            version: '1'
        }
    },
    {
        id: '2',
        name: 'feature 2.2',
        type: 'standard',
        metadata: {
            version: '2'
        }
    },
    {
        id: '1',
        name: 'feature 1.2',
        type: 'standard',
        metadata: {
            version: '2'
        }
    },
    {
        id: '3',
        name: 'feature 3',
        type: 'standard',
        metadata: {
            version: '1'
        }
    },
    {
        id: '3',
        name: 'feature 3',
        type: 'standard',
        metadata: {
            version: '1'
        }
    },
]

// Sort to the highest version first
const sorted = features.sort((a,b) => parseInt(b.metadata.version,10) -parseInt(a.metadata.version,10))

// Dedupe - take the highest version
const result = sorted.filter((feature,index,array) => index === array.findIndex(f => (f.id === feature.id)))

console.log(result)
/*
[{
  "id": "2",
  "name": "feature 2.2",
  "type": "standard",
  "metadata": {
    "version": "2"
  }
}, {
  "id": "1",
  "name": "feature 1.2",
  "type": "standard",
  "metadata": {
    "version": "2"
  }
}, {
  "id": "3",
  "name": "feature 3",
  "type": "standard",
  "metadata": {
    "version": "1"
  }
}]
*/