using UnityEngine;
using System.Collections;
using Assets.Scripts.AI.Allosaurus;

namespace Assets.Scripts.AI
{
	class DinoAI : MonoBehaviour
	{

		protected NavMeshAgent navAgent;
		protected Dinosaur me;
		
		public float detectRadius = 1000;
		public float stopDistance = 10;
		protected GameObject curTarget = null;

		protected IDecision intelligence;
		GameObject target = null;

		public void Start ()
		{
			switch (gameObject.GetComponent<DinosaurObjectGetter> ().type ()) {

			case DinosaurType.Allosaurus:
				intelligence = new AllosaurusIdle ();
				break;

			}

			navAgent = gameObject.GetComponent<NavMeshAgent> ();
			me = gameObject.GetComponent<DinosaurObjectGetter> ().dinosaur ();
			navAgent.speed = me.Movespeed ();
		}
        
		void Update ()
		{
			intelligence.Decide (gameObject, target);
			intelligence.Act (gameObject, target);
		}

		public void UpdateDecision (IDecision choice)
		{
			intelligence = choice;
		}

		public IDecision getNextDecision()
		{
			return null;
		}


		public GameObject GetNewTarget ()
		{
			Collider[] hitColliders = Physics.OverlapSphere (gameObject.transform.position, detectRadius);
			foreach (Collider otherObject in hitColliders) {
				if (otherObject.gameObject.tag == "Player") {
					return otherObject.gameObject;
				}
			}
			return null;
		}

		public Dinosaur getDinosaur () {
			return me;
		}

		public NavMeshAgent getNavAgent () {
			return navAgent;
		}

		public void setTarget(GameObject newTarget) {
			curTarget = newTarget;
		}

		public GameObject getTarget() {
			return curTarget;
		}
	}
}
