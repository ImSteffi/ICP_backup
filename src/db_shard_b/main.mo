import Debug "mo:base/Debug";

persistent actor class DbShardB() = {
  public query func test_query() : async () {
    Debug.print("test_query");
  };
};