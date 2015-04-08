using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.AI.Allosaurus
{
	class AllosaurusIdle : IDecision
	{

		public void Decide (GameObject self, GameObject target)
		{
			AllosaurusAI dino = self.GetComponent<AllosaurusAI> ();
			bool found_other = false;
			int layer = 1 << 8;
			Collider[] hitColliders = Physics.OverlapSphere (self.transform.position, dino.detectRadius, layer);
			foreach (Collider otherObject in hitColliders) {
				if (otherObject.gameObject != self) {
					found_other = true;
				}
			}
			if (found_other) {
				dino.UpdateDecision ();
			}
		}

		public void Act (GameObject self, GameObject target)
		{
			AllosaurusAI dino = self.GetComponent<AllosaurusAI> ();
			dino.getNavAgent ().destination = self.transform.position;

			Animation ani = self.GetComponentInChildren<Animation> ();
			if (!ani.IsPlaying ("Attack01") && !ani.IsPlaying ("Attack02")) {
				ani.Play ("Idle");
			}
		}
	}
}
