using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.AI.Allosaurus
{
	class AllosaurusApproach: IDecision
	{

		public void Decide (GameObject self, GameObject target)
		{
			bool found = false;
			int layer = 1 << 8;
			Collider[] hitColliders = Physics.OverlapSphere (self.transform.position, self.GetComponent<AllosaurusAI> ().detectRadius, layer);
			foreach (Collider otherObject in hitColliders) {
				if (otherObject.gameObject.tag == "Player") {
					found = true;
					break;
				}
			}
			if (!found) {
				self.GetComponent<AllosaurusAI> ().UpdateDecision (self.GetComponent<AllosaurusAI> ().getNextDecision ());
			}
		}

		public void Act (GameObject self, GameObject target)
		{
			Animation ani = self.GetComponentInChildren<Animation> ();
			AllosaurusAI dino = self.GetComponent<AllosaurusAI> ();
			if (!ani.IsPlaying ("Attack01")) {
				ani.Play ("Walk");
			}
			if (dino.getDinosaur ().Is_Alive ()) {
				target = dino.GetNewTarget ();
				if (target) {
					dino.getNavAgent ().destination = target.transform.position;
				}
			}
		}
	}
}
