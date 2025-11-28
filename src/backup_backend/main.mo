import Debug "mo:core/Debug";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Error "mo:core/Error";

shared (msg) persistent actor class BackupBackend() = {
  Debug.print("Deployer/Owner: " # Principal.toText(msg.caller));
  private var owners : [Principal] = [msg.caller];

  let bootTime = Time.now();
  public query func getBootTime() : async Int {
    bootTime
  };

  public query ({ caller }) func test_query() : async () {
    Debug.print("test_query");
    Debug.print(Principal.toText(caller));
  };

  public type Role = { #owner; #admin; #user };

  // Use Map from mo:core/Map for roles
  private var roles : Map.Map<Principal, Role> = Map.empty<Principal, Role>();

  func principal_eq(a : Principal, b : Principal) : Bool { a == b };

  func is_owner(principal : Principal) : Bool {
    Array.find<Principal>(owners, func(x) { x == principal }) != null
  };

  func get_role(principal : Principal) : ?Role {
    if (is_owner(principal)) { ?#owner }
    else { Map.get(roles, Principal.compare, principal) }
  };

  public shared ({ caller }) func assign_role(assignee : Principal, new_role : Role) : async () {
    let caller_role = get_role(caller);
    if (caller_role == ?#owner or caller_role == ?#admin) {
      Map.add(roles, Principal.compare, assignee, new_role);
    } else {
      Debug.print("Unauthorized to assign roles by " # Principal.toText(caller));
      throw Error.reject("You are not authorized to assign roles");
    }
  };

  public shared ({ caller }) func my_role() : async ?Role {
    get_role(caller)
  };

  public shared ({ caller }) func privileged_action() : async Text {
    let role = get_role(caller);
    if (role == ?#owner or role == ?#admin) {
      "You are authorized!"
    } else {
      throw Error.reject("Access denied");
    }
  };
};