using UnityEngine;
using System.Collections;

public class BasicWalkingScript : MonoBehaviour {

	private NavMeshAgent navAgent;

	public float detectRadius;

	// Use this for initialization
	void Start () {
		navAgent = gameObject.GetComponent<NavMeshAgent> ();
	}
	
	// Update is called once per frame
	void Update () {
		if ((navAgent.velocity.magnitude < new Vector3(0.1f, 0.1f, 0.1f).magnitude) && (navAgent.velocity.magnitude > new Vector3(-0.1f, -0.1f, -0.1f).magnitude)) {
			GetTarget();
		}
	}

	protected void GetTarget() {
		Collider[] hitColliders = Physics.OverlapSphere(gameObject.transform.position, detectRadius);
		foreach (Collider otherObject in hitColliders) {
			if (otherObject.gameObject.name == "First Person Controller") {
				navAgent.ResetPath();
				Vector3 position = otherObject.gameObject.transform.position;
				if (Vector3.Distance(position, gameObject.transform.position) > navAgent.stoppingDistance) {
					NavMeshPath path = new NavMeshPath();
					navAgent.CalculatePath(position, path);
					navAgent.SetPath(path);
				}
				break;
			}
		}
	}
}
