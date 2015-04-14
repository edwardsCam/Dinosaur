using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.AI.PassiveAllosaurus
{
	class PassiveAllosaurusIdle : IDecision
	{

		public void Decide (GameObject self, GameObject target)
		{
//			Dinosaur dino = self.GetComponent<DinosaurObjectGetter> ().dinosaur ();
//			bool found_other = false;
//			int layer = 1 << 8;
//			Collider[] hitColliders = Physics.OverlapSphere (self.transform.position, dino._DetectRadius (), layer);
//			foreach (Collider otherObject in hitColliders) {
//				if (otherObject.gameObject != self) {
//					found_other = true;
//				}
//			}
//			if (found_other) {
//				self.GetComponent<PassiveAllosaurusAI> ().UpdateDecision ();
//			}
		}

		public void Act (GameObject self, GameObject target)
		{
			PassiveAllosaurusAI dino = self.GetComponent<PassiveAllosaurusAI> ();
			float detectRadius = self.GetComponent<DinosaurObjectGetter> ().dinosaur ()._DetectRadius ();

			if (UnityEngine.Random.value <= 0.025) {
				Vector3 randomDirection = UnityEngine.Random.insideUnitSphere * detectRadius;
				
				randomDirection += self.transform.position;
				NavMeshHit hit;
				NavMesh.SamplePosition (randomDirection, out hit, detectRadius, 1);
				Vector3 finalPosition = hit.position;
				dino.getNavAgent ().destination = finalPosition;
			}

			Animation ani = self.GetComponentInChildren<Animation> ();
			if (!ani.IsPlaying ("Attack01") && !ani.IsPlaying ("Attack02")) {
				if (dino.getNavAgent().speed > 0.5) {
					ani.Play ("Walk");
				} else {
					ani.Play ("Idle");
				}
			}
		}
	}
}
