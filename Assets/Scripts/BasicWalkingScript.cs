using UnityEngine;
using System.Collections;

public class BasicWalkingScript : MonoBehaviour {

	private NavMeshAgent navAgent;

	public float detectRadius;
	public float stopDistance;
	public Transform target;

	// Use this for initialization
	void Start () {
		navAgent = gameObject.GetComponent<NavMeshAgent> ();

	}
	
	// Update is called once per frame
	void Update () {
//		print (navAgent.destination);
//		print (navAgent.remainingDistance);
//		pritn (navAgent.
		if (target == null) {
			target = GameObject.FindGameObjectWithTag("Player").transform;
		}

		navAgent.destination = target.position;
//		if (navAgent.remainingDistance > navAgent.stoppingDistance || double.IsInfinity(navAgent.remainingDistance) || navAgent.remainingDistance <= navAgent.stoppingDistance / 2) {
//			print ("setting target");
//		}
//		if (navAgent.remainingDistance <= stopDistance || double.IsInfinity(navAgent.remainingDistance)) {
//
//			GetTarget();
//		}
	}

	protected void GetTarget() {
//		Collider[] hitColliders = Physics.OverlapSphere(gameObject.transform.position, detectRadius);
//		foreach (Collider otherObject in hitColliders) {
//			if (otherObject.gameObject.name == "First Person Controller") {
//				navAgent.ResetPath();
//				Vector3 position = otherObject.gameObject.transform.position;
//				if (Vector3.Distance(position, gameObject.transform.position) > navAgent.stoppingDistance) {
//					NavMeshPath path = new NavMeshPath();
//					navAgent.CalculatePath(position, path);
//					navAgent.SetPath(path);
//				}
//				break;
//			}
//		}
	}
}
