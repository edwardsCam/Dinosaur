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
			bool found_other = false;
			Dinosaur dino = self.GetComponent<DinosaurObjectGetter> ().dinosaur ();
			int layer = 1 << 8;
			Collider[] hitColliders = Physics.OverlapSphere (self.transform.position, dino._DetectRadius (), layer);
			foreach (Collider otherObject in hitColliders) {
				if (otherObject.gameObject != self) {
					found_other = true;
					break;
				}
			}
			if (!found_other) {
				self.GetComponent<AllosaurusAI> ().UpdateDecision ();
			}
		}

		public void Act (GameObject self, GameObject target)
		{
			Animation ani = self.GetComponentInChildren<Animation> ();
			AllosaurusAI dino = self.GetComponent<AllosaurusAI> ();
			if (!ani.IsPlaying ("Attack01") && !ani.IsPlaying ("Attack02")) {
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
