import Debug "mo:base/Debug";

persistent actor class DbShardE() = {
  public query func test_query() : async () {
    Debug.print("test_query");
  };
};