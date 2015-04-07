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
			GameObject player = GameObject.FindGameObjectWithTag ("Player");

			if (player != null) {
				if (Vector3.Distance (player.transform.position, self.transform.position) < 40) {
					self.GetComponent<DinoAI> ().UpdateDecision (self.GetComponent<AllosaurusAI>().getNextDecision());
				}
			}
		}

		public void Act (GameObject self, GameObject target)
		{
			Animation ani = self.GetComponent<Animation> ();
			ani.Play ("Allosaurus_Idle");
		}
	}
}
