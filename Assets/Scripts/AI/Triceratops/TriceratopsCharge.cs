using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.AI.Triceratops
{
    class TriceratopsCharge: IDecision
    {

        Vector3 chargeLocation = Vector3.zero;
        NavMeshAgent navAgent;
        float detectRadius = 30;
        public TriceratopsCharge()
        {
            
            Debug.Log("Charging");
        }
        public void Decide(UnityEngine.GameObject self, UnityEngine.GameObject target)
        {
            navAgent = self.GetComponent<NavMeshAgent>();
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
                self.GetComponent<DinoAI>().UpdateDecision();
            }
        }

        public void Act(UnityEngine.GameObject self, UnityEngine.GameObject target)
        {
            if(chargeLocation == Vector3.zero)
            {
                chargeLocation = target.transform.position;
            }
            if (Vector3.Distance(self.transform.position, chargeLocation) > navAgent.stoppingDistance)
            {
                NavMeshPath path = new NavMeshPath();
                navAgent.CalculatePath(chargeLocation, path);
                navAgent.SetPath(path);
            }
            self.GetComponent<Animation>().PlayQueued("Allosaurus_Run");
        }
    }
}
