using UnityEngine;
using System.Collections;
using Assets.Scripts.Utilities;
using Assets.Scripts;

public class DinoSpawner : MonoBehaviour
{

	public GameObject tRex;
	public GameObject raptor;
	public GameObject allosaurus;
	public GameObject triceratops;
	public GameObject spinosaurus;
	public GameObject brachiosaurus;
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
		switch (dino) {
		case DinosaurType.TRex:
			Spawn (tRex);
			break;
		case DinosaurType.Raptor:
			Spawn (raptor);
			break;
		case DinosaurType.Allosaurus:
			Spawn (allosaurus);
			break;
		case DinosaurType.Triceratops:
			Spawn (triceratops);
			break;
		case DinosaurType.Spinosaurus:
			Spawn (spinosaurus);
			break;
		case DinosaurType.Brachiosaurus:
			Spawn (brachiosaurus);
			break;
		}
	}

	private void Spawn (GameObject dino)
	{
		var instance = GameObject.Instantiate (dino, new Vector3 (0, 4000, 0), Quaternion.identity) as GameObject;
		instance.tag = "Player";
		instance.GetComponent<DinoController> ().SpawnAsPlayer ();
	}
}
