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
			int layer = 1 << 8;
			Collider[] hitColliders = Physics.OverlapSphere (self.transform.position, self.GetComponent<AllosaurusAI> ().detectRadius, layer);
			foreach (Collider otherObject in hitColliders) {
				if (otherObject.gameObject.tag == "Player") {
					self.GetComponent<DinoAI> ().UpdateDecision (self.GetComponent<AllosaurusAI> ().getNextDecision ());
				}
			}
		}

		public void Act (GameObject self, GameObject target)
		{
			AllosaurusAI dino = self.GetComponent<AllosaurusAI> ();
			dino.getNavAgent ().destination = self.transform.position;

			Animation ani = self.GetComponentInChildren<Animation> ();
			ani.Play ("Allosaurus_Idle");
		}
	}
}
