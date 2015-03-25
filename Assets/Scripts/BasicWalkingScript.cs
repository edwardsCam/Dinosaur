using UnityEngine;
using System.Collections;

public class BasicWalkingScript : MonoBehaviour
{

	private NavMeshAgent navAgent;
	private Dinosaur me;

	public float detectRadius;
	public float stopDistance;
	public GameObject target = null;

	public float attack_cooldown = 0.5f;
	private float attack_timer = 0f;
	private bool attack_is_cooling_down = false;

	// Use this for initialization
	void Start ()
	{
		navAgent = gameObject.GetComponent<NavMeshAgent> ();
		me = new Species.Allosaurus ();
		navAgent.speed = me.Movespeed ();
	}
	
	// Update is called once per frame
	void Update ()
	{
		if (me.Is_Alive ()) {
			float delta = Time.deltaTime;
//		print (navAgent.destination);
//		print (navAgent.remainingDistance);
//		pritn (navAgent.
			target = GetTarget ();
			if (target) {
				navAgent.destination = target.transform.position;
				if (Vector3.Distance (gameObject.transform.position, target.transform.position) < me.Attack_Radius ()) {
					DinoController player = target.GetComponent ("DinoController") as DinoController;
					if (!attack_is_cooling_down && player != null) {
						me.Attack (player.GetDinosaur ());
						attack_is_cooling_down = true;
					}
				}
			}
			if (attack_is_cooling_down) {
				attack_timer += delta;
				if (attack_timer > attack_cooldown) {
					attack_timer = 0f;
					attack_is_cooling_down = false;
				}
			}
			me.Heal (delta);
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
