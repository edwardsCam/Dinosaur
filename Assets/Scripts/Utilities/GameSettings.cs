using UnityEngine;
using System.Collections;
using Assets.Scripts.Utilities;

namespace Assets.Scripts.Utilities
{
	public class GameSettings: MonoBehaviour
	{
		public DinosaurType currentDino;

		void Awake ()
		{
			DontDestroyOnLoad (transform.gameObject);
		}
		public DinosaurType GetCurrentDinosaur ()
		{
			return currentDino;
		}

		public void SetCurrentDinosaur (DinosaurType dino)
		{
			currentDino = dino;
		}
	}
}
