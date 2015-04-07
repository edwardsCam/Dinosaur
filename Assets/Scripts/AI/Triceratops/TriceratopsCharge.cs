using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.AI.Triceratops
{
    class TriceratopsCharge: IDecision
    {

        Vector3 chargeLocation;
        NavMeshAgent navAgent;
        float detectRadius = 10;
        public TriceratopsCharge(GameObject self, GameObject target)
        {
            chargeLocation = target.transform.position;
            navAgent = self.GetComponent<NavMeshAgent>();
        }
        public void Decide(UnityEngine.GameObject self, UnityEngine.GameObject target)
        {
            if (Vector3.Distance(self.transform.position, chargeLocation) < navAgent.stoppingDistance)
            {
                CheckForPlayer(self, target);
            }
        }

        private void CheckForPlayer(GameObject self, GameObject target)
        {
            bool playerWithinRange = false;
            Collider[] hitColliders = Physics.OverlapSphere(self.transform.position, detectRadius);
            foreach (Collider otherObject in hitColliders)
            {
                if (otherObject.gameObject.name == "First Person Controller")
                {
                    playerWithinRange = true;
                    chargeLocation = otherObject.transform.position;
                }
            }

            if(!playerWithinRange)
            {
                self.GetComponent<DinoAI>().UpdateTarget(null);
                self.GetComponent<DinoAI>().UpdateDecision(new TriceratopsIdle());
            }
        }

        public void Act(UnityEngine.GameObject self, UnityEngine.GameObject target)
        {
            if (Vector3.Distance(self.transform.position, chargeLocation) > navAgent.stoppingDistance)
            {
                NavMeshPath path = new NavMeshPath();
                navAgent.CalculatePath(chargeLocation, path);
                navAgent.SetPath(path);
            }
        }
    }
}
