import Debug "mo:core/Debug";
import Time "mo:core/Time";
import Int "mo:core/Int";

persistent actor class BackupBackend() = {
  let bootTime = Time.now();
  public query func getBootTime() : async Int {
    return bootTime;
  };
  public query func test_query() : async () {
    Debug.print("test_query");
  };
};