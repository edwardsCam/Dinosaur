using UnityEngine;
using System.Collections;
using Assets.Scripts;
using UnityEngine.UI;

public class VitalsVM : MonoBehaviour {

    public GameObject healthBar;
    public GameObject staminaBar;
    private Text healthText;
    private Slider healthSlider;
    private Text staminaText;
    private Slider staminaSlider;

	// Use this for initialization
	void Start () 
    {
        healthSlider = healthBar.GetComponent<Slider>();
        staminaSlider = staminaBar.GetComponent<Slider>();
        healthText = healthBar.GetComponentInChildren<Text>();
        staminaText = staminaBar.GetComponentInChildren<Text>();
    }
	
	// Update is called once per frame
	void Update () 
    {
        healthSlider.value = .5F;
        staminaSlider.value = .7F;
        healthText.text = "50%";
        staminaText.text = "70%";

	}
}

