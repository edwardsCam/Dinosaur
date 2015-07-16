using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.AI.Triceratops
{
    public class TriceratopsIdle :IDecision
    {
        public float detectRadius = 30;
        public TriceratopsIdle()
        {
            Debug.Log("Idle-ing");
        }
        
        public void Decide(UnityEngine.GameObject self, UnityEngine.GameObject target)
        {
            Collider[] hitColliders = Physics.OverlapSphere(self.transform.position, detectRadius);
            	foreach (Collider otherObject in hitColliders) 
                {
            		if (otherObject.gameObject.tag == "Player") 
                    {
                        var ai = self.GetComponent<TriceratopsAI>();
                        ai.UpdateDecision();
            		}
            	}
        }

        public void Act(UnityEngine.GameObject self, UnityEngine.GameObject target)
        {
            self.GetComponent<NavMeshAgent>().ResetPath();
            self.GetComponent<Animation>().PlayQueued("Allosaurus_Idle");
        }
    }
}
