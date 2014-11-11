/*jslint browser : false, continue : true,
devel : true, indent : 2, maxerr : 50,
newcap : true, nomen : true, plusplus : true,
regexp : true, sloppy : true, vars : false,
white : true
*/
/*global console, describe, it, expect, beforeEach, jasmine, spyOn, afterEach, require */

var LRUCache = require('../src/lruCache.js').LRUCache;

describe('lruCache', function(){
    var batchInsert;

    //-------- Begin utility functions --------//
    batchInsert = function(cache, data){
        var i;
        for(i = 0; i < data.length; i++){
            cache.put(data[i][0],data[i][1]);
        }
    };    // batchInsert end
    //-------- End utility functions --------//

    it('should have the appropriate namespace defined', function(){
        expect(LRUCache).toBeDefined();
    });

    it('should have the factory method defined', function(){
        expect(typeof LRUCache.cache).toEqual('function');
    });

    describe('LRU Cache capacity : ', function(){
        it('should allow creating cache objects with appropriate capacity', function(){
            var c1 = LRUCache.cache(4), c2 = LRUCache.cache(2);
            expect(c1.capacity()).toEqual(4);
            expect(c2.capacity()).toEqual(2);
        });

        it('should throw an error if a non-positive capacity is provided', function(){
            expect(function(){
                LRUCache.cache(0);
            }).toThrow(new Error('LRU Cache must have a positive capacity : 0 provided'));

            expect(function(){
                LRUCache.cache(-2);
            }).toThrow(new Error('LRU Cache must have a positive capacity : -2 provided'));
        });

    });

    describe('LRU cache accessors : ', function(){
        var cache;
        beforeEach(function(){
            cache = LRUCache.cache(1);
        });

        it('should return undefined for a key that is not present', function(){
            expect(cache.get('testKey')).toBeUndefined();
        });

        it('should add items to cache and return appropriate values for keys in cache', function(){
            var testData = { 'test' : 2};
            cache.put('testKey',testData);
            expect(cache.get('testKey')).toBe(testData);
        });
    });

    describe('LRU Cache overflow : ', function(){
        var cache, cache1;

        beforeEach(function(){
            cache = LRUCache.cache(3);
            cache1 = LRUCache.cache(1);
        });
        it('should delete least recently used values on overflow', function(){
            batchInsert(cache, [[0,0],[1,1],[2,2],[3,3],[4,4]]);
            expect(cache.get(2)).toEqual(2);
            expect(cache.get(1)).toBeUndefined();
            expect(cache.get(0)).toBeUndefined();

            batchInsert(cache1,[[3,3],[2,2],[1,1]]);
            expect(cache1.get(2)).toBeUndefined();
            expect(cache1.get(3)).toBeUndefined();
            expect(cache1.get(1)).toEqual(1);
        });      

        it('should not overflow for insert of an existing key', function(){
            batchInsert(cache, [[0,0],[1,1],[2,2],[3,3],[3,3]]);
            expect(cache.get(0)).toBeUndefined();
            expect(cache.get(1)).toEqual(1);
            expect(cache.get(2)).toEqual(2);
            expect(cache.get(3)).toEqual(3);

            batchInsert(cache1,[[3,3],[2,2],[2,2]]);
            expect(cache1.get(3)).toBeUndefined();
            expect(cache1.get(2)).toEqual(2);
        });


        it('should update use order for value on get', function(){
            batchInsert(cache, [[0,0],[1,1],[2,2]]);
            cache.get(0);
            cache.put(3,3);
            expect(cache.peek(0)).toEqual(0);
            expect(cache.peek(1)).toBeUndefined();
            cache.put(4,4);
            expect(cache.peek(0)).toEqual(0);
            cache.put(5,5);
            expect(cache.peek(0)).toBeUndefined();

            cache1.put(1,1);
            expect(cache1.get(1)).toEqual(1);
            cache1.put(2,2);
            expect(cache1.get(1)).toBeUndefined();
        });
    });

    describe('cache remove and clear : ', function(){
        var cache, smallCache;
        beforeEach(function(){
            cache = LRUCache.cache(3);
            smallCache = LRUCache.cache(1);
        });

        it('should remove items from the cache', function(){
            expect(cache.size()).toEqual(0);
            batchInsert(cache, [[1,1],[2,2],[3,3]]);
            expect(cache.size()).toEqual(3);
            cache.remove(2);
            expect(cache.size()).toEqual(2);
            cache.remove(3);
            expect(cache.size()).toEqual(1);

            smallCache.put(1,1);
            expect(smallCache.size()).toEqual(1);
            smallCache.remove(1);
            expect(smallCache.size()).toEqual(0);
        });

        it('should ignore remove requests for items not in the cache', function(){
            expect(cache.size()).toEqual(0);
            batchInsert(cache, [[1,1],[2,2],[3,3]]);
            expect(cache.size()).toEqual(3);
            cache.remove(5);
            expect(cache.size()).toEqual(3);
            cache.remove(3);
            expect(cache.size()).toEqual(2);

            smallCache.put(1,1);
            expect(smallCache.size()).toEqual(1);
            smallCache.remove(2);
            expect(smallCache.size()).toEqual(1);
        });

        it('should allow clearing all items from the cache', function(){
            expect(cache.size()).toEqual(0);
            batchInsert(cache, [[1,1],[2,2],[3,3]]);
            expect(cache.size()).toEqual(3);
            cache.clear();
            expect(cache.size()).toEqual(0);            
            expect(cache.capacity()).toEqual(3);            

            smallCache.put(1,1);
            expect(smallCache.size()).toEqual(1);
            smallCache.clear();
            expect(smallCache.size()).toEqual(0);
            expect(smallCache.capacity()).toEqual(1);
        });
    });
});