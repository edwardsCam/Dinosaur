using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.AI.Triceratops
{
    class TriceratopsIdle :IDecision
    {
        public float detectRadius;
        public void Decide(UnityEngine.GameObject self, UnityEngine.GameObject target)
        {
            Collider[] hitColliders = Physics.OverlapSphere(self.transform.position, detectRadius);
            	foreach (Collider otherObject in hitColliders) 
                {
            		if (otherObject.gameObject.name == "First Person Controller") 
                    {
                        DinoAI ai = self.GetComponent<DinoAI>();
                        ai.UpdateTarget(otherObject.gameObject);
                        ai.UpdateDecision(new TriceratopsCharge(self, otherObject.gameObject));
            		}
            	}
        }

        public void Act(UnityEngine.GameObject self, UnityEngine.GameObject target)
        {
            self.GetComponent<NavMeshAgent>().ResetPath();
        }
    }
}
