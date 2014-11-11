#LRU Cache#

##Efficient in memory cache for objects with LRU policy for cleanup##
Allows for constant time get, put and remove operations

##Methods##

###size()###
returns cache size

##Design##
The cache has been implemented using a combination of hashmap/dictionary (basically a DS for efficient key-value lookups, Javascript - already solves this problem for us through its objects.) and a doubly linked list (for easy management of the priority queue for items by the latest access time)

    (head - most recently used) v1 <==> v2 <==> v3 <==> v4 <==> v5 (tail - least recently used)
                                |       |       |       |       |
                              { k1      k2      k3      k4      k5 } (map for value lookup)

When the cache is at capacity and another item is added, it removes the least recently used one.

##Testing##
The cache does not use any browser specific features so testing within the node runtime is enough.    

* jasmine has been used for writing tests
* jasmine-node is being used for running tests.    

jasmine-node will have to be installed globally if one wants to use the command directly on command line.
    npm install -g jasmine-node

tests can then be run using the command - the test code is present in 'test' directory
    jasmine-node test