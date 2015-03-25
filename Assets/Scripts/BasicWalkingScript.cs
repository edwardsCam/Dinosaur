using UnityEngine;
using System.Collections;

public class BasicWalkingScript : MonoBehaviour
{

	private NavMeshAgent navAgent;
	private Dinosaur me;

	public float detectRadius;
	public float stopDistance;
	public GameObject target = null;

	// Use this for initialization
	void Start ()
	{
		detectRadius = 1000; //TODO
		navAgent = gameObject.GetComponent<NavMeshAgent> ();
		me = new Species.Allosaurus ();
		navAgent.speed = me.Movespeed ();
	}
	
	// Update is called once per frame
	void Update ()
	{
//		print (navAgent.destination);
//		print (navAgent.remainingDistance);
//		pritn (navAgent.
		target = GetTarget ();

		navAgent.destination = target.transform.position;

		if (target) {	
			if (Vector3.Distance (gameObject.transform.position, target.transform.position) < me.Attack_Radius ()) {
				DinoController player = target.GetComponent ("DinoController") as DinoController;
				me.Attack (player.GetDinosaur ());
			}
		}		
//		if (navAgent.remainingDistance > navAgent.stoppingDistance || double.IsInfinity(navAgent.remainingDistance) || navAgent.remainingDistance <= navAgent.stoppingDistance / 2) {
//			print ("setting target");
//		}
//		if (navAgent.remainingDistance <= stopDistance || double.IsInfinity(navAgent.remainingDistance)) {
//
//			GetTarget();
//		}
	}

	protected GameObject GetTarget ()
	{
		Collider[] hitColliders = Physics.OverlapSphere (gameObject.transform.position, detectRadius);
		foreach (Collider otherObject in hitColliders) {
			if (otherObject.gameObject.tag == "Player") {
				return otherObject.gameObject;
			}
		}
		return null;
	}
	
	public Dinosaur GetDinosaur ()
	{
		return me;
	}
}
