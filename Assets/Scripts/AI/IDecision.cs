using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.AI
{
    interface IDecision
    {
        void Decide(GameObject self, GameObject target);

        void Act(GameObject self, GameObject target);
    }
}
