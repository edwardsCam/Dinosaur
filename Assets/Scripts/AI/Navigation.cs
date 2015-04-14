using UnityEngine;
using System.Collections;

public class Navigation : MonoBehaviour
{

	private NavMeshAgent navAgent;
	private Dinosaur me;
	private GameObject target = null;

	// Use this for initialization
	void Start ()
	{
		navAgent = gameObject.GetComponent<NavMeshAgent> ();
		me = gameObject.GetComponent<DinosaurObjectGetter> ().dinosaur ();
		navAgent.speed = me._Movespeed ();
	}
	
	// Update is called once per frame
	void Update ()
	{
		if (me.Is_Alive ()) {
			target = GetTarget ();
			if (target) {
				navAgent.destination = target.transform.position;
			}
//		if (navAgent.remainingDistance > navAgent.stoppingDistance || double.IsInfinity(navAgent.remainingDistance) || navAgent.remainingDistance <= navAgent.stoppingDistance / 2) {
//			print ("setting target");
//		}
//		if (navAgent.remainingDistance <= stopDistance || double.IsInfinity(navAgent.remainingDistance)) {
//
//			GetTarget();
//		}
		}
	}

	protected GameObject GetTarget ()
	{
		Collider[] hitColliders = Physics.OverlapSphere (gameObject.transform.position, me._DetectRadius ());
		foreach (Collider otherObject in hitColliders) {
			if (otherObject.gameObject.tag == "Player") {
				return otherObject.gameObject;
			}
		}
		return null;
	}
}
