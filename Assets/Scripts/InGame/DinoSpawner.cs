using UnityEngine;
using System.Collections;
using Assets.Scripts.Utilities;
using Assets.Scripts;

public class DinoSpawner : MonoBehaviour
{

	public GameObject tRex;
	public GameObject raptor;
	public GameObject allosaurus;
	// Use this for initialization
	void Awake ()
	{
		GameSettings settings = GameObject.FindGameObjectWithTag ("Settings").GetComponent<GameSettings> ();
		SpawnDino (settings.GetCurrentDinosaur ());
		StartUI ();
		DestroySpawner ();
	}

	private void StartUI ()
	{
		GameObject.FindGameObjectWithTag ("UIManager").GetComponent<VitalsVM> ().Initialize ();
	}

	private void DestroySpawner ()
	{
		//test
		Destroy (gameObject, 3);
	}

	private void SpawnDino (DinosaurType dino)
	{
		//I know this is bad code but I'm using it as a hotfix.
		if (dino == DinosaurType.TRex) {
			Spawn (tRex);
		} else if (dino == DinosaurType.Raptor) {
			Spawn (raptor);
		} else if (dino == DinosaurType.Allosaurus) {
			Spawn (allosaurus);
		}
	}

	private void Spawn (GameObject dino)
	{
		var instance = GameObject.Instantiate (dino, new Vector3 (0, 100, 0), Quaternion.identity) as GameObject;
		instance.tag = "Player";
		instance.GetComponent<DinoController> ().SpawnAsPlayer ();
	}
}
