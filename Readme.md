#LRU Cache#

##Efficient in-memory cache with LRU policy for cleanup##
Allows for constant time get, put and remove operations

##Methods##

###get(key)###
returns the item associated with specified key or undefined if key is not present in the cache.    
Also updates the last accessed priority for the specified item, making it the most recently used one.

###put(key, value)###
Adds specified key, value pair to the cache. Causes the Least recently item to be discarded if the cache is at its capacity.    
If the specified key is already present in cache, then the corresponding value is updated(overwritten) and the access priority is updated for the given key, making it the most recently used item.

###capacity()###
returns cache maximum capacity

###size()###
returns cache occupancy - the total number of items currently present in the cache

###remove(key)###
Removes specified item from the cache, reducing occupancy by 1. Doesnt do anything if the key specified is not present in the cache

###clear()###
Removes all elements from the cache

###peek(key)###
behaves the same way as get(key), except that it doesnt affect the access priority of the item i.e. one just peeks at the item without updating the cache cleanup priorities.
Utility method (mostly for testing)

##Design##
The cache has been implemented using a combination of a hashmap/dictionary (for efficient key-value lookups, Javascript - already solves this problem for us through its objects) and a doubly linked list (for easy management of the priority queue of items by the latest access time)

    (head - most recently used) v1 <==> v2 <==> v3 <==> v4 <==> v5 (tail - least recently used)
                                |       |       |       |       |
                              { k1      k2      k3      k4      k5 } (map for value lookup)

When the cache is at capacity and another item is added, it removes the least recently used one.

##Testing##
The cache does not use any browser specific features so testing within the node runtime is enough.    

* jasmine has been used for writing tests
* jasmine-node has been used for running tests.    

jasmine-node will have to be installed globally if one wants to use the command directly on command line.   
```shell
npm install -g jasmine-node
```

tests can then be run using th following command - the test code is present in 'test' directory        
```shell
jasmine-node test
```

##Example##
```Javascript
    var cache = LRUCache.cache(3);  // Create and get a new cache with a capacity of 3 items
    cache.capacity();               // returns 3
    cache.put('k1',1);              // priority queue =  k1->|
    cache.put('k2',2);              // priority queue = k2->k1->|
    cache.put('k3',3);              // priority queue = k3->k2->k1->|
    cache.put('k4',4);              // priority queue = k4->k3->k2->|
    cache.get('k1');                // returns undefined
    cache.get('k3');                // returns 3, priority queue = k3->k4->k2->|
    cache.put('k2','test');         // priority queue = k2->k3->k4->| and value associated with k2 becomes 'test'
    cache.put('k5',5);              // priority queue = k5->k2->k3->|
    cache.peek('k2');               // returns 'test', priority queue = k5->k2->k3->|
    cache.remove('k2');             // priority queue = k5->k3->|
    cache.size();                   // returns 2
    cache.clear();                  // cache becomes empty
    cache.size();                   // returns 0
```
