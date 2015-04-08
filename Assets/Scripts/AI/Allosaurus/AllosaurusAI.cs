using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.AI.Allosaurus
{
	class AllosaurusAI : DinoAI
	{

		private NavMeshAgent navAgent;
		private Dinosaur me;
		
		public float detectRadius = 1000;
		public float stopDistance = 10;
		private GameObject target = null;
		
		public new IDecision getNextDecision()
		{
			if (intelligence == null) {
				return new AllosaurusIdle ();
			} else if (intelligence is AllosaurusIdle) {
				return new AllosaurusApproach ();
			} else if (intelligence is AllosaurusApproach) {
				return new AllosaurusIdle ();
			} else {
				return base.getNextDecision ();
			}
		}

		public GameObject GetTarget ()
		{
			Collider[] hitColliders = Physics.OverlapSphere (gameObject.transform.position, detectRadius);
			foreach (Collider otherObject in hitColliders) {
				if (otherObject.gameObject.tag == "Player") {
					return otherObject.gameObject;
				}
			}
			return null;
		}

		// Use this for initialization
		public new void Start () {
			base.Start ();
			navAgent = gameObject.GetComponent<NavMeshAgent> ();
			me = gameObject.GetComponent<DinosaurObjectGetter> ().dinosaur ();
			navAgent.speed = me.Movespeed ();
		}

		public Dinosaur getDinosaur () {
			return me;
		}

		public NavMeshAgent getNavAgent () {
			return navAgent;
		}

		public void setTarget(GameObject newTarget) {
			target = newTarget;
		}

		public GameObject getTarget() {
			return target;
		}
	}
}
