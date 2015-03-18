using UnityEngine;
using System.Collections;
using Assets.Scripts;
using UnityEngine.UI;

public class VitalsVM : MonoBehaviour
{

	public GameObject healthBar;
	public GameObject staminaBar;
	private Text healthText;
	private Slider healthSlider;
	private Text staminaText;
	private Slider staminaSlider;
	private DinoController dino_controller;
	bool ready = false;
	// Use this for initialization
	public void Initialize ()
	{
		healthSlider = healthBar.GetComponent<Slider> ();
		staminaSlider = staminaBar.GetComponent<Slider> ();
		healthText = healthBar.GetComponentInChildren<Text> ();
		staminaText = staminaBar.GetComponentInChildren<Text> ();
		dino_controller = GameObject.FindGameObjectWithTag ("Player").GetComponent<DinoController> ();
		ready = true;
	}
	
	// Update is called once per frame
	void Update ()
	{
		if (ready) {
			Dinosaur d = dino_controller.GetDinosaur ();
			float currhp = d.Current_HP ();
			float currstam = d.Current_Stamina ();
			float maxhp = d.Max_HP ();
			float maxstam = d.Max_Stamina ();
			healthSlider.value = currhp / maxhp;
			staminaSlider.value = currstam / maxstam;
			healthText.text = ((int)currhp).ToString () + '/' + ((int)maxhp).ToString ();
			staminaText.text = ((int)currstam).ToString () + '/' + ((int)maxstam).ToString ();
		}
	}
}

